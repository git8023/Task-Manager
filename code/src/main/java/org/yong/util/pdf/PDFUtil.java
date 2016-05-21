package org.yong.util.pdf;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.dom4j.DocumentException;
import org.xhtmlrenderer.pdf.ITextFontResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.yong.util.file.FileUtil;
import org.yong.util.string.StringUtil;

import com.alibaba.fastjson.util.IOUtils;
import com.lowagie.text.pdf.BaseFont;

/**
 * @Author Huang.Yong
 * @Description: PDF 工具
 * @Date 2015年12月12日 下午6:49:47
 * @Version 0.1
 */
public class PDFUtil {

	/** PDF导出配置 */
	private PDFExportConf exportConf;

	/**
	 * @Title: PDFUtil
	 * @Description: 获取工具实例
	 * @param exportConf 导出配置
	 */
	public PDFUtil(PDFExportConf exportConf) {
		super();
		this.exportConf = exportConf;
	}

	/**
	 * @Title: export
	 * @Description: 导出PDF
	 * @param htmlFilePath HTML模板文件
	 * @throws Exception
	 */
	public File export() throws Exception {
		// 获取渲染器
		ITextRenderer renderer = createRenderer(this.exportConf.getHtmlTemplate());

		// 解决中文问题
		if (this.exportConf.hasCN()) {
			containerChinese(renderer);
		}

		// 生成PDF
		renderer.layout();
		File pdfFile = FileUtil.createQuietly(this.exportConf.getPdfPath());
		OutputStream os = null;
		try {
			os = new FileOutputStream(pdfFile);
			renderer.createPDF(os);
		} finally {
			IOUtils.close(os);
		}

		return pdfFile;
	}

	/**
	 * @Title: containerChinese
	 * @Description: 设置中文字体
	 * @param renderer 渲染器
	 * @throws DocumentException
	 * @throws IOException
	 */
	private void containerChinese(ITextRenderer renderer) throws Exception {
		ITextFontResolver fontResolver = renderer.getFontResolver();
		if (StringUtil.isWindowsSys()) {
			fontResolver.addFont("c:/Windows/Fonts/simsun.ttc", BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
		} else {
			// mac
			// fontResolver.addFont("/library/fonts/Arial Unicode.ttf",
			// BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);

			// linux：
			// fontResolver.addFont("/usr/share/fonts/TTF/ARIALUNI.TTF",
			// BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
		}
	}

	/**
	 * @Title: createRenderer
	 * @Description: 创建渲染器
	 * @param htmlFilePath HTML模板文件
	 * @return 渲染器
	 * @throws IOException ITextRenderer
	 */
	private ITextRenderer createRenderer(String htmlFilePath) throws IOException {
		ITextRenderer renderer = new ITextRenderer();
		File temporaryFile = new File(StringUtil.getFullFilePath(htmlFilePath));
		String url = temporaryFile.toURI().toURL().toString();
		renderer.setDocument(url);
		return renderer;
	}

}
