package com.sstm888labs.restexample.springmvc.domain;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Yuming Zhang<sstm888@gmail.com>
 */
@Entity
@Table(name = "equipmentList")
public class Equipment implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public enum Status {

        DRAFT,
        PUBLISHED
    }

    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eupId")
    private Long eupId;


    @Column(name = "erId")
    private Long erId;

    @Column(name = "roomName")
    private String roomName;

    @Column(name = "isPrimary")
    @Size(max = 2000)
    private Integer isPrimary;

    @Column(name = "mac")
    private String mac;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    public Long getEupId() {
        return eupId;
    }

    public void setEupId(Long eupId) {
        this.eupId = eupId;
    }

    public Long getErId() {
        return erId;
    }

    public void setErId(Long erId) {
        this.erId = erId;
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

    @PrePersist
    public void prePersist() {
        this.createdDate = new Date();
    }

    @Override
    public String toString() {
        return "Equipment{" + "id=" + eupId + ", roomName=" + roomName + ", isPrimary=" + isPrimary + ", mac=" + mac + '}';
    }

}
