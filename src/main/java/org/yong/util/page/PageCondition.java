package org.yong.util.page;

import java.io.Serializable;

/**
 * @Author Huang.Yong
 * @Description: 分页查询条件
 * @Date 2016年4月3日 下午8:18:46
 * @Version 0.1
 */
public class PageCondition implements Serializable {

	// @Fields serialVersionUID :
	private static final long serialVersionUID = 1890292905429310303L;

	private Integer pageIndex = 1;

	private Integer pageSize = 10;

	private Integer pageNumCount = 5;

	/**
	 * @Title: getPageIndex
	 * @Description: 获取当前页码
	 * @return Integer 当前页码
	 */
	public Integer getPageIndex() {
		return pageIndex;
	}

	/**
	 * @Title: setPageIndex
	 * @Description: 设置当前页码
	 * @param pageIndex 当前页码
	 */
	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}

	/**
	 * @Title: getPageSize
	 * @Description: 获取分页大小
	 * @return Integer 分页大小
	 */
	public Integer getPageSize() {
		return pageSize;
	}

	/**
	 * @Title: setPageSize
	 * @Description: 设置分页大小
	 * @param pageSize 分页大小
	 */
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	/**
	 * @Title: getPageNumCount
	 * @Description: 获取页码数量
	 * @return Integer 页码数量
	 */
	public Integer getPageNumCount() {
		return pageNumCount;
	}

	/**
	 * @Title: setPageNumCount
	 * @Description: 设置页码数量
	 * @param pageNumCount 页码数量
	 */
	public void setPageNumCount(Integer pageNumCount) {
		this.pageNumCount = pageNumCount;
	}

	@Override
	public String toString() {
		return "PageCondition [pageIndex=" + pageIndex + ", pageSize=" + pageSize + ", pageNumCount=" + pageNumCount + "]";
	}

}
