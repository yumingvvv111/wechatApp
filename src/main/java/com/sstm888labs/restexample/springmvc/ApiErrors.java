
package com.sstm888labs.restexample.springmvc;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 */
public final class ApiErrors {
	
    private static final String PREFIX = "errors.";

    public static final String INVALID_REQUEST = PREFIX + "INVALID_REQUEST";
    
    private ApiErrors() {
        throw new InstantiationError( "Must not instantiate this class" );
    }
}
