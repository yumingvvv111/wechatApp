
package com.sstm888labs.restexample.springmvc.exception;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final Long id;

    public ResourceNotFoundException(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
