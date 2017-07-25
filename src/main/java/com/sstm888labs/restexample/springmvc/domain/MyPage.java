package com.sstm888labs.restexample.springmvc.domain;

/**
 * Created by apple on 6/23/17.
 */
public interface MyPage<L> {
    int getCode();
    String getMessage();
    L getData();

}
