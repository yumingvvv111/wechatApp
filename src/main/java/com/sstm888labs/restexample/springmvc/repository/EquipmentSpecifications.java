package com.sstm888labs.restexample.springmvc.repository;

import com.sstm888labs.restexample.springmvc.domain.Equipment;
import com.sstm888labs.restexample.springmvc.domain.EquipmentData;
import com.sstm888labs.restexample.springmvc.domain.Post;
//import com.sstm888labs.restexample.springmvc.domain.Post_;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 *
 */
public final class EquipmentSpecifications {

	private EquipmentSpecifications() {
	      throw new InstantiationError( "Must not instantiate this class" );
	}

    public static Specification<Equipment> filterByKeywordAndStatus(
            final String keyword) {
        return (Root<Equipment> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
//            if (StringUtils.hasText(keyword)) {
//                predicates.add(
//                        cb.or(
//                                cb.like(root.get(Post_.title), "%" + keyword + "%"),
//                                cb.like(root.get(Post_.content), "%" + keyword + "%")
//                        )
//                );
//            }
//
//            if (status != null) {
//                predicates.add(cb.equal(root.get(Post_.status), status));
//            }

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

    public static Specification<EquipmentData> filterByKeyword(
            final String keyword) {
        return (Root<EquipmentData> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
//            if (StringUtils.hasText(keyword)) {
//                predicates.add(
//                        cb.or(
//                                cb.like(root.get(Post_.title), "%" + keyword + "%"),
//                                cb.like(root.get(Post_.content), "%" + keyword + "%")
//                        )
//                );
//            }
//
//            if (status != null) {
//                predicates.add(cb.equal(root.get(Post_.status), status));
//            }

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

}
