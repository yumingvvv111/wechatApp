package com.sstm888labs.restexample.springmvc.domain;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Yuming Zhang<sstm888@gmail.com>
 */
@Entity
@Table(name = "equipmentData")
public class EquipmentData implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 2L;

    public enum Status {

        DRAFT,
        PUBLISHED
    }

    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pm25")
    private Float pm25;


    @Column(name = "ch2")
    private Float ch2;


    @Column(name = "pollutionLevel")
    private Float pollutionLevel;

    @Column(name = "tvoc")
    private Float tvoc;

    @Column(name = "humity")
    private Float humity;

    @Column(name = "temperature")
    private Float temperature;

    @Column(name = "time")
    private String time;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Float getPm25() {
        return pm25;
    }

    public void setPm25(Float pm25) {
        this.pm25 = pm25;
    }

    public Float getCh2() {
        return ch2;
    }

    public void setCh2(Float ch2) {
        this.ch2 = ch2;
    }

    public Float getPollutionLevel() {
        return pollutionLevel;
    }

    public void setPollutionLevel(Float pollutionLevel) {
        this.pollutionLevel = pollutionLevel;
    }

    public Float getTvoc() {
        return tvoc;
    }

    public void setTvoc(Float tvoc) {
        this.tvoc = tvoc;
    }

    public Float getHumity() {
        return humity;
    }

    public void setHumity(Float humity) {
        this.humity = humity;
    }

    public Float getTemperature() {
        return temperature;
    }

    public void setTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "{}";
    }

}
