package org.yong.util.file;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveOutputStream;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.util.CollectionUtils;
import org.yong.tm.web.util.WebUtil;
import org.yong.util.string.OgnlUtil;
import org.yong.util.string.StringUtil;
import org.yong.util.vo.EntryVO;

import com.google.common.collect.Lists;

/**
 * @Author Huang.Yong
 * @Description: 文件工具类
 * @Date 2016年4月23日 下午7:41:14
 * @Version 0.1
 */
public class FileUtil {

	public static final String WEB_PROJECT_PATH = StringUtil.getWebProjectPath();

	public static final Object FILE_CONTENT_NEW_LINE = System.getProperty("line.separator");

	/**
	 * @Title: deleteByRelativePath
	 * @Description: 删除文件
	 * @param relativePath 文件相对路径(相对项目根目录)
	 */
	public static void deleteByRelativePath(String relativePath) {
		if (StringUtil.isEmpty(relativePath, true)) {
			return;
		}

		File file = getAbsolutePath(relativePath);
		FileUtils.deleteQuietly(file);
	}

	/**
	 * @Title: getAbsolutePath
	 * @Description: 获取文件绝对路径
	 * @param relativePath 文件相对路径(相对项目根目录)
	 * @return String 文件绝对路径
	 */
	private static File getAbsolutePath(String relativePath) {
		return new File(WEB_PROJECT_PATH, relativePath);
	}

	/**
	 * @Title: compress
	 * @Description: 压缩指定文件列表
	 * @param files 目标文件列表
	 * @param zipName 压缩文件名
	 * @param dir 存放压缩文件的文件夹
	 * @return File 压缩文件
	 * @throws Exception
	 */
	public static File zip(List<File> files, String zipName, String dir) throws Exception {
		if (CollectionUtils.isEmpty(files) || !StringUtil.valid(true, zipName, dir)) {
			throw new IllegalArgumentException("Parameter invalid[files=" + files + "][zipName=" + zipName + "][dir=" + dir + "]");
		}
		File outFile = WebUtil.getFile(dir + "/" + zipName);
		return zip(files, outFile);
	}

	/**
	 * @Title: zip
	 * @Description: zip压缩算法打包文件列表
	 * @param files 被打包的文件列表
	 * @param outputZipFile zip输出文件
	 * @return File zip输出文件
	 * @throws FileNotFoundException
	 * @throws ArchiveException
	 * @throws IOException
	 */
	public static File zip(List<File> files, File outputZipFile) throws FileNotFoundException, ArchiveException, IOException {
		ArchiveOutputStream out = null;
		try {
			BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(outputZipFile));
			ArchiveStreamFactory archiveStreamFactory = new ArchiveStreamFactory();
			out = archiveStreamFactory.createArchiveOutputStream(ArchiveStreamFactory.JAR, bufferedOutputStream);

			for (File file : files) {
				ZipArchiveEntry zipArchiveEntry = new ZipArchiveEntry(file, file.getName());
				out.putArchiveEntry(zipArchiveEntry);
				IOUtils.copy(new FileInputStream(file), out);
				out.closeArchiveEntry();
			}
			out.finish();
		} finally {
			IOUtils.closeQuietly(out);
		}

		return outputZipFile;
	}

	/**
	 * @Title: createQuietly
	 * @Description: 创建文件, 总是保证上级文件夹已存在
	 * @param path 目标路径文件夹
	 * @return File 目标文件
	 */
	public static File createQuietly(String path) {
		File file = new File(path);
		if (!file.exists()) {
			File dir = file.getParentFile();

			if (!dir.exists()) {
				dir.mkdirs();
			}

			try {
				file.createNewFile();
			} catch (Exception ignore) {
				return null;
			}
		}
		return file;
	}

	/**
	 * @Title: parsePlaceholder
	 * @Description: 解析模板中的占位符. 占位符格式: #{key}/#{prop.key}/#{ognlExpression},
	 *               占位符不可换行.
	 * @param template 模板文件
	 * @param vo 值对象
	 * @return String 解析完成后的文件内容
	 * @throws Exception
	 */
	public static String parsePlaceholder(File template, Object vo) throws Exception {
		StringBuilder result = new StringBuilder();
		List<String> lines = FileUtils.readLines(template);
		// 占位符规则: 只有字母/$/_且只有一级属性; 只有字母/$/_/.且不能以.结尾
		final String PLACEHOLDER_REGEX = "#\\{[$a-zA-Z\\_]+([$a-zA-Z\\_]+\\.)*[^\\.]+\\}";
		final String PLACEHOLDER_ONGL_REGEX = "[^\\{][$a-zA-Z\\_]+([$a-zA-Z\\_]+\\.)*[^\\.][^\\}]+";
		for (String lineCtt : lines) {

			// 提取占位符&OGNL表达式
			List<EntryVO<String, String>> placeholders = getPlaceholders(PLACEHOLDER_REGEX, PLACEHOLDER_ONGL_REGEX, lineCtt);
			if (CollectionUtils.isEmpty(placeholders)) {
				// 保留普通描述内容
				result.append(lineCtt);
			}

			for (EntryVO<String, String> entry : placeholders) {
				// 进一步提取OGNL表达式
				String ognl = entry.getValue();

				// 过滤非法OGNL表达式
				if (StringUtil.isEmpty(ognl, true)) {
					result.append(lineCtt);
					continue;
				}

				// 使用OGNL表达式在VO中获取值
				Object value = null;
				try {
					value = OgnlUtil.getValue(ognl, vo);
				} catch (Exception ignored) {
				}

				if (null != value) {
					// 获取成功, 替换占位符
					String placeholder = entry.getKey();
					lineCtt = lineCtt.replace(placeholder, value.toString());
				}

				result.append(lineCtt);
			}
		}

		return result.toString();
	}

	/**
	 * @Title: getPlaceholders
	 * @Description: 提取字符串中所有匹配规则的子字符串和占位符中包含的OGNL表达式
	 * @param placeholderPattern 占位符规则
	 * @param ognlPattern 占位符OGNL规则
	 * @param content 目标字符串
	 * @return Map&lt;String,String&gt; 匹配成功的字符串集合, Key-占位符, Value-OGNL表达式
	 */
	private static List<EntryVO<String, String>> getPlaceholders(String placeholderPattern, String ognlPattern, String content) {
		List<EntryVO<String, String>> list = Lists.newArrayList();

		Pattern valRegex = Pattern.compile(ognlPattern);
		Pattern placeholderRegex = Pattern.compile(placeholderPattern);

		Matcher placeholderMatcher = placeholderRegex.matcher(content);
		while (placeholderMatcher.find()) {
			String placeholder = placeholderMatcher.group();

			// 提取占位符中的OGNL表达式
			Matcher valMatcher = valRegex.matcher(placeholder);
			if (valMatcher.find()) {
				String ognl = valMatcher.group();
				list.add(new EntryVO<String, String>(placeholder, ognl));
			}
		}
		return list;
	}

}
