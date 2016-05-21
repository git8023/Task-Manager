package org.yong.util.vo;

/**
 * @Author Huang.Yong
 * @Description: 通用键值对值对象
 * @Date 2016年5月4日 下午8:38:44
 * @Version 0.1
 */
public class EntryVO<K, V> {
	private K key;

	private V value;

	public EntryVO() {
		super();
	}

	public EntryVO(K key, V value) {
		super();
		this.key = key;
		this.value = value;
	}

	public K getKey() {
		return key;
	}

	public void setKey(K key) {
		this.key = key;
	}

	public V getValue() {
		return value;
	}

	public void setValue(V value) {
		this.value = value;
	}

	@Override
	public String toString() {
		return "EntryVO [key=" + key + ", value=" + value + "]";
	}

}
