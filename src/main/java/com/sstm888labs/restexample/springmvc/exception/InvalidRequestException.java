package com.sstm888labs.restexample.springmvc.exception;

import org.springframework.validation.BindingResult;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 */
public class InvalidRequestException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final BindingResult errors;

    public InvalidRequestException(BindingResult errors) {
        this.errors = errors;
    }

    public BindingResult getErrors() {
        return this.errors;
    }
}
