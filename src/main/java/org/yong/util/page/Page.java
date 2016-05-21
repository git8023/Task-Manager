/**
 * @FileName: Page.java
 * @Author 黄勇
 * @Description: 分页VO
 * @Date 2014年12月21日 下午5:09:35
 * @CopyRight CNP Corporation
 */
package org.yong.util.page;

import java.util.ArrayList;
import java.util.List;

/**
 * 分页VO实体类
 * 
 * @param <E> 数据类型
 */
public class Page<E> {

	private Integer rowCount; // 总行数

	private List<E> data; // 数据列表

	private Integer pageIndex; // 页码

	private Integer pageSize; // 页大小

	private Integer pageTotal; // 总页数

	private Integer beginNum; // 起始页码

	private Integer endNum; // 结束页码

	/**
	 * @Title: Page
	 * @Description: 获取分页对象
	 */
	public Page() {
		rowCount = 0;
		data = new ArrayList<>();
		pageIndex = 1;
		pageSize = 1;
		pageTotal = 1;
		beginNum = endNum = 1;
	}

	/**
	 * @Title: Page
	 * @Description: 获取分页对象
	 * @param pageCondition 分页条件
	 * @param dataHandler 数据处理器
	 */
	public Page(PageCondition pageCondition, DataHandler<E> dataHandler) {
		this(pageCondition.getPageIndex(), pageCondition.getPageSize(), dataHandler, pageCondition.getPageNumCount());
	}

	/**
	 * @Title: Page
	 * @Description: 获取分页对象, 并初始化部分属性
	 * @param page 分页实例对象, 并使用以下属性初始化 <br>
	 *            rowCount 总行数 <br>
	 *            pageIndex 当前页码 <br>
	 *            pageSize 页大小 <br>
	 *            pageTotal 总页数 <br>
	 *            beginNum 开始页码 <br>
	 *            endNum 结束页码 <br>
	 */
	public Page(Page<?> page) {
		super();
		this.rowCount = page.rowCount;
		this.pageIndex = page.pageIndex;
		this.pageSize = page.pageSize;
		this.pageTotal = page.pageTotal;
		this.beginNum = page.beginNum;
		this.endNum = page.endNum;
	}

	/**
	 * @Description: 获取分页对象新实例
	 * @param pageIndex 页码
	 * @param pageSize 页大小
	 * @param handler 数据处理器接口实例
	 */
	public Page(Integer pageIndex, Integer pageSize, DataHandler<E> handler) {
		this(pageIndex, pageSize, handler, null);
	}

	/**
	 * @Description: 获取分页对象新实例
	 * @param pageIndex 页码
	 * @param pageSize 页大小
	 * @param handler 数据处理器接口实例
	 * @param pageNumCount 页面要显示的页码数量, 值为0或null时, 不计算.
	 */
	public Page(Integer pageIndex, Integer pageSize, DataHandler<E> handler, Integer pageNumCount) {
		invoke(pageIndex, pageSize, handler, pageNumCount);
	}

	/**
	 * @Title: invoke
	 * @Description: 执行分页查询
	 * @param pageIndex 页码
	 * @param pageSize 页大小
	 * @param handler 数据处理器
	 * @param pageNumCount 页码数量
	 */
	private void invoke(Integer pageIndex, Integer pageSize, DataHandler<E> handler, Integer pageNumCount) {
		reviseSize(pageSize);
		setRowCount(handler.getRowCount());
		setPageTotal();
		reviseIndex(pageIndex);
		setData(handler.getElements(this.pageIndex, this.pageSize));
		clacPagerNums(pageNumCount);
	}

	/**
	 * @Title: clacPagerNums
	 * @Description: 计算页码值
	 * @param pageNumCount 页面要显示的页码数量, 值为0或null时, 不计算.
	 */
	private void clacPagerNums(Integer pageNumCount) {
		if (pageNumCount == null || pageNumCount <= 0) {
			return;
		}

		if (pageNumCount == 1) {
			beginNum = endNum = pageIndex;
			return;
		}

		int offset = pageNumCount / 2;
		int begin = pageIndex - offset;
		int end = pageIndex + offset;

		if (end > pageTotal) {
			begin -= end - pageTotal;
			end = pageTotal;
			if (begin < 1) {
				begin = 1;
			}
		}

		if (begin < 1) {
			end += Math.abs(begin) + 1;
			begin = 1;
			if (end > pageTotal) {
				end = pageTotal;
			}
		}

		this.beginNum = begin;
		this.endNum = end;
	}

	/**
	 * 修正页大小
	 * 
	 * @param pageSize2
	 */
	private void reviseSize(Integer pageSize) {
		if (pageSize == null || pageSize <= 0) {
			pageSize = 10;
		}
		this.pageSize = pageSize;
	}

	/**
	 * @Title: getPageTotal
	 * @Description: 获取总页数
	 * @return Integer 总页数
	 */
	public Integer getPageTotal() {
		return pageTotal;
	}

	/**
	 * @Title: setPageTotal
	 * @Description: 设置总页数
	 */
	private void setPageTotal() {
		if (rowCount == 0) {
			pageTotal = 1;
		} else {
			pageTotal = (rowCount + pageSize - 1) / pageSize;
		}
	}

	/**
	 * @Title: reviseIndexAndSize
	 * @Description: 修正页码
	 * @param pageIndex 页码
	 */
	private void reviseIndex(Integer pageIndex) {
		if (pageIndex == null || pageIndex <= 0) {
			this.pageIndex = 1;
		} else {
			this.pageIndex = pageIndex;
		}

		if (this.pageIndex > this.pageTotal) {
			this.pageIndex = this.pageTotal;
		}

		if (this.pageIndex <= 0) {
			this.pageIndex = 1;
		}
	}

	public Integer getRowCount() {
		return rowCount;
	}

	public void setRowCount(Integer rowCount) {
		this.rowCount = rowCount;
	}

	public List<E> getData() {
		return data;
	}

	public void setData(List<E> data) {
		this.data = data;
	}

	public Integer getPageIndex() {
		return pageIndex;
	}

	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getBeginNum() {
		return beginNum;
	}

	public void setBeginNum(Integer beginNum) {
		this.beginNum = beginNum;
	}

	public Integer getEndNum() {
		return endNum;
	}

	public void setEndNum(Integer endNum) {
		this.endNum = endNum;
	}

	public void setPageTotal(Integer pageTotal) {
		this.pageTotal = pageTotal;
	}

	@Override
	public String toString() {
		return "Page [rowCount=" + rowCount + ", data=" + data + ", pageIndex=" + pageIndex + ", pageSize=" + pageSize
				+ ", pageTotal=" + pageTotal + ", beginPageNum=" + beginNum + ", endPageNum=" + endNum + "]";
	}
}
