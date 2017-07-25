package com.sstm888labs.restexample.springmvc.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Used to transport messages back to the client.
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 */
public class ResponseMessage {

    public enum Type {
        success, warning, danger, info;
    }

    private Type type;
    private String text;
    private String code;
    
    private List<Error> errors = new ArrayList<Error>();

    public ResponseMessage(Type type, String text) {
        this.type = type;
        this.text = text;
    }

    public ResponseMessage(Type type, String code, String message) {
        this.type = type;
        this.code = code;
        this.text = message;
    }

    public String getText() {
        return text;
    }

    public Type getType() {
        return type;
    }

    public String getCode() {
        return code;
    }
    
    public static ResponseMessage success(String text) {
        return new ResponseMessage(Type.success, text);
    }

    public static ResponseMessage warning(String text) {
        return new ResponseMessage(Type.warning, text);
    }

    public static ResponseMessage danger(String text) {
        return new ResponseMessage(Type.danger, text);
    }

    public static ResponseMessage info(String text) {
        return new ResponseMessage(Type.info, text);
    }


    public List<Error> getErrors() {
        return errors;
    }

    public void setErrors(List<Error> errors) {
        this.errors = errors;
    }

    public void addError(String field, String code, String message) {
        this.errors.add(new Error(field, code, message));
    }

    class Error {

        private final String code;
        private final String message;
        private final String field;

        private Error(String field, String code, String message) {
            this.field = field;
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }

        public String getField() {
            return field;
        }

    }

}
