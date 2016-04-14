package com.gsd.dao;

import java.util.List;

import com.gsd.model.KeyAccountManager;

public interface KeyAccountManagerDao {

	public List<KeyAccountManager> showKeyAccMng();

	public List<KeyAccountManager> searchKeyAccMng(String search);

	public int getLastKeyAccId();

	public void updateKeyAccMng(KeyAccountManager keyAccMng);

	public void createKeyAccMng(KeyAccountManager keyAccMng);

	public void deleteKeyAccMng(int id);

	public void updateCustomer(int key_acc_id);
	
}
