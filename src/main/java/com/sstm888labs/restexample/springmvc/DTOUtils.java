
package com.sstm888labs.restexample.springmvc;

import java.util.*;

import com.sstm888labs.restexample.springmvc.domain.EquipmentData;
import com.sstm888labs.restexample.springmvc.domain.MyPage;
import com.sstm888labs.restexample.springmvc.domain.MyPageImp;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 */
public final class DTOUtils {

    private static final ModelMapper INSTANCE = new ModelMapper();
    
    private DTOUtils() {
        throw new InstantiationError( "Must not instantiate this class" );
    }

    public static <S, T> T map(S source, Class<T> targetClass) {
        return INSTANCE.map(source, targetClass);
    }

    public static <S, T> void mapTo(S source, T dist) {
        INSTANCE.map(source, dist);
    }

    public static <S, T> List<T> mapList(List<S> source, Class<T> targetClass) {
        List<T> list = new ArrayList<>();
        for (int i = 0; i < source.size(); i++) {
            T target = INSTANCE.map(source.get(i), targetClass);
            list.add(target);
        }

        return list;
    }

    public static <S, T> Page<T> mapPage(Page<S> source, Class<T> targetClass) {
        List<S> sourceList = source.getContent();

        List<T> list = new ArrayList<>();
        for (int i = 0; i < sourceList.size(); i++) {
            T target = INSTANCE.map(sourceList.get(i), targetClass);
            list.add(target);
        }

        return new PageImpl<>(list, new PageRequest(source.getNumber(), source.getSize(), source.getSort()),
                source.getTotalElements());
    }

    public static <S, T> MyPageImp mapList(Page<S> source, Class<T> targetClass) {
        List<S> sourceList = source.getContent();

        List<T> list = new ArrayList<>();
        for (int i = 0; i < sourceList.size(); i++) {
            T target = INSTANCE.map(sourceList.get(i), targetClass);
            list.add(target);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("dataList", list);
        return new MyPageImp<>(map);
    }

    public static <S, T> List myMapList(List<S> source, Class<T> targetClass) {
        List<S> sourceList = source;

        Map<String, Object> map = new HashMap<>();
        List<T> list = new ArrayList<>();
        for (int i = 0; i < sourceList.size(); i++) {
            T target = INSTANCE.map(sourceList.get(i), targetClass);
            list.add(target);
        }

        return list;
    }
}
