package com.sstm888labs.restexample.springmvc;

public final class Constants {

    /**
     * prefix of REST API
     */
    public static final String URI_API = "/api";

    public static final String URI_POSTS = "/posts";

    public static final String URI_TEST = "/test";

    public static final String URI_REST = "/restEquiment";

    public static final String URI_EQUIPMENT = "/equiment";

    public static final String URI_COMMENTS = "/comments";
    
    private Constants() {
        throw new InstantiationError( "Must not instantiate this class" );
    }
    
}
