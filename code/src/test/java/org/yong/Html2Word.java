package org.yong;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.junit.Test;

import com.alibaba.fastjson.util.IOUtils;

public class Html2Word {
	@Test
	public void htmlToWord2() throws Exception {
		InputStream bodyIs = new FileInputStream("I:/java/Apache/test/1.html");
		InputStream cssIs = new FileInputStream("I:/java/Apache/test/1.css");
		String body = this.getContent(bodyIs);
		String css = this.getContent(cssIs);
		// 拼一个标准的HTML格式文档
		String content = "<html><head><style>" + css + "</style></head><body>" + body + "</body></html>";
		InputStream is = new ByteArrayInputStream(content.getBytes("UTF-8"));
		OutputStream os = new FileOutputStream("I:/java/Apache/test/1.doc");
		this.inputStreamToWord(is, os);
	}

	/**
	 * 把is写入到对应的word输出流os中 不考虑异常的捕获，直接抛出
	 * 
	 * @param is
	 * @param os
	 * @throws IOException
	 */
	private void inputStreamToWord(InputStream is, OutputStream os) throws IOException {
		@SuppressWarnings("resource")
		POIFSFileSystem fs = new POIFSFileSystem();
		try {
			// 对应于org.apache.poi.hdf.extractor.WordDocument
			fs.createDocument(is, "WordDocument");
			fs.writeFilesystem(os);
		} finally {
			IOUtils.close(is);
			IOUtils.close(os);
		}
	}

	/**
	 * 把输入流里面的内容以UTF-8编码当文本取出。 不考虑异常，直接抛出
	 * 
	 * @param ises
	 * @return
	 * @throws IOException
	 */
	private String getContent(InputStream... ises) throws IOException {
		if (ises != null) {
			StringBuilder result = new StringBuilder();
			BufferedReader br;
			String line;
			for (InputStream is : ises) {
				br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				while ((line = br.readLine()) != null) {
					result.append(line);
				}
			}
			return result.toString();
		}
		return null;
	}
}
