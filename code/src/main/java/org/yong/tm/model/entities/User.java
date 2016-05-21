package org.yong.tm.model.entities;

import java.io.Serializable;
import java.util.Date;

import org.yong.tm.model.enums.UserIdentity;

public class User implements Serializable {

	private static final long serialVersionUID = 521947551185192528L;

	private String account;

	private String pwd;

	private String name;

	private UserIdentity identity;

	private User createdBy;

	private Date createdDate;

	public User() {
		super();
	}

	/**
	 * @Title: User
	 * @Description: 创建用户新实例
	 * @param account 用户账户
	 */
	public User(String account) {
		super();
		this.account = account;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserIdentity getIdentity() {
		return identity;
	}

	public void setIdentity(UserIdentity identity) {
		this.identity = identity;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	@Override
	public String toString() {
		return "User [account=" + account + ", pwd=" + pwd + ", name=" + name + ", identity=" + identity + ", createdBy="
				+ createdBy + ", createdDate=" + createdDate + "]";
	}

}
