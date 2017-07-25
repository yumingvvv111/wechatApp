package com.sstm888labs.restexample.springmvc.repository;
import java.util.Collection;
import java.util.List;

import com.sstm888labs.restexample.springmvc.domain.EquipmentData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;


public interface EquipmentDataRepository extends JpaRepository<EquipmentData, Long>,//
        JpaSpecificationExecutor<EquipmentData>{

    @Query("select u from EquipmentData u")
    List<EquipmentData> findByCharacter(Pageable page);



}
