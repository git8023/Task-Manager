package org.yong.util.pdf;

/**
 * @Author Huang.Yong
 * @Description: PDF配置
 * @Date 2015年12月13日 上午10:32:23
 * @Version 0.1
 */
public class PDFExportConf {

	private String htmlTemplate;

	private Boolean hasCN;

	private String pdfPath;

	/**
	 * @Title: PdfConf
	 * @Description: 获取配置实例
	 */
	public PDFExportConf() {
	}

	/**
	 * @Title: PdfConf
	 * @Description: 获取配置实例
	 * @param htmlTemplate HTML模板文件路径
	 * @param pdfPath 生成PDF目标(绝对)路径
	 */
	public PDFExportConf(String htmlTemplate, String pdfPath) {
		super();
		this.htmlTemplate = htmlTemplate;
		this.pdfPath = pdfPath;
	}

	/**
	 * @Title: PdfConf
	 * @Description: 获取配置实例
	 * @param htmlTemplate HTML模板文件路径
	 * @param hasCN 是否包含中文数据
	 * @param pdfPath 生成PDF目标(绝对)路径
	 */
	public PDFExportConf(String htmlTemplate, boolean hasCN, String pdfPath) {
		super();
		this.htmlTemplate = htmlTemplate;
		this.hasCN = hasCN;
		this.pdfPath = pdfPath;
	}

	public String getHtmlTemplate() {
		return htmlTemplate;
	}

	public void setHtmlTemplate(String htmlTemplate) {
		this.htmlTemplate = htmlTemplate;
	}

	public boolean hasCN() {
		return hasCN;
	}

	public void setHasCN(boolean hasCN) {
		this.hasCN = hasCN;
	}

	public String getPdfPath() {
		return pdfPath;
	}

	public void setPdfPath(String pdfPath) {
		this.pdfPath = pdfPath;
	}
}
