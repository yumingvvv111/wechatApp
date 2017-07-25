package com.sstm888labs.restexample.springmvc.domain;

import java.util.List;

/**
 * Created by apple on 6/23/17.
 */
public class MyPageImp<T> implements MyPage<T> {

    private int code;
    private String message;
    private T data;
    public MyPageImp(T data){
        this.code = 0;
        this.message = "success";
        this.data = data;
    }
    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    @Override
    public T getData() {
        return data;
    }
}
