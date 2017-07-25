package com.sstm888labs.restexample.springmvc.model;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 *
 */
public class EquipmentListDetails implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private Long erId;

    private Long eupId;

    private String roomName;

    private String mac;

    private Integer isPrimary;

    private Date createdDate;



    public Long getErId(){
       return erId;
    }

    public void setErId(Long erId) {

        this.erId = erId;
    }

    public Long getEupId() {
        return eupId;
    }

    public void setEupId(Long eupId) {
        this.eupId = eupId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getMac() {
        return mac;
    }

    public void setMac(String mac) {
        this.mac = mac;
    }

    public Integer getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Integer isPrimary) {
        this.isPrimary = isPrimary;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }
    

    @Override
    public String toString() {
        return "PostDetails{" + "id=" + erId + ", roomName=" + roomName + ", mac=" + mac + ", isPrimary=" + isPrimary + ", createdDate=" + createdDate + '}';
    }

}
