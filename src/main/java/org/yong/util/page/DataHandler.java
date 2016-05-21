/**
 * @FileName: DataHandler.java
 * @Author 黄勇
 * @Description: 分页数据处理器
 * @Date 2014年12月21日 下午5:48:17
 * @CopyRight CNP Corporation
 */
package org.yong.util.page;

import java.util.List;

/**
 * 分页数据处理器
 * 
 * @param <E> 数据类型
 */
public interface DataHandler<E> {

	/**
	 * @Title: getElements
	 * @Description: 获取数据列表
	 * @param pageSize 页大小
	 * @param pageIndex 页码
	 * @return List&lt;E&gt; 数据列表
	 */
	List<E> getElements(Integer pageIndex, Integer pageSize);

	/**
	 * @Title: getRowCount
	 * @Description: 获取数据总行数
	 * @return Integer 总行数
	 */
	Integer getRowCount();

}
