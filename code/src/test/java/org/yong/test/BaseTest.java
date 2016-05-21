package org.yong.test;


/**
 * @FileName: BaseTest.java
 * @Author Huang.Yong
 * @Description:
 * @Date 2015年10月9日 下午4:19:49
 * @CopyRight CNP Corporation
 */

import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @Author Huang.Yong
 * @Description: 测试基类
 * @CopyRight CNP Corporation
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-mvc.xml" })
public class BaseTest {
}
