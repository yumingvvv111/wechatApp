package com.sstm888labs.restexample.springmvc.model;

import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 *
 */
public class EquipmentChartDetails implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private Float pm25;

    private Float ch2;

    private Float pollutionLevel;

    private Float tvoc;

    private Float humity;

    private Float temperature;

    private String time;

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

    public Float getPm25() {
        return pm25;
    }

    public void setPm25(Float pm25) {
        this.pm25 = pm25;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    @Override
    public String toString() {
        return "{}";
    }

}
