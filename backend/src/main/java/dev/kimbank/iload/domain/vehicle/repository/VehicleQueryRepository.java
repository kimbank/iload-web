package dev.kimbank.iload.domain.vehicle.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.kimbank.iload.domain.file.entity.QRegisteredVehiclePhoto;
import dev.kimbank.iload.domain.vehicle.dto.*;
import dev.kimbank.iload.domain.vehicle.entity.*;
import dev.kimbank.iload.domain.vehicle.entity.enums.AccidentInfoEnum;
import dev.kimbank.iload.domain.vehicle.entity.enums.RepaintedEnum;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VehicleQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public VehicleQueryRepository(EntityManager entityManager) {
        this.jpaQueryFactory = new JPAQueryFactory(entityManager);
    }

    // 사용자 차량 카드 목록 조회
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByUserId(Long userId, Pageable pageable) {
        QRegisteredVehicle registeredVehicle = QRegisteredVehicle.registeredVehicle;
        QRegisteredVehiclePhoto registeredVehiclePhoto = QRegisteredVehiclePhoto.registeredVehiclePhoto;

        List<RegisteredVehicleCardResponse> content = jpaQueryFactory
                .select(Projections.constructor(RegisteredVehicleCardResponse.class,
                        registeredVehicle.id,
                        registeredVehicle.users.id,
                        registeredVehicle.users.username,
                        registeredVehicle.manufacturer,
                        registeredVehicle.releaseYear,
                        registeredVehicle.mileage,
                        registeredVehicle.sellingPrice,
                        registeredVehiclePhoto.fileUrl,
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .leftJoin(registeredVehiclePhoto)
                .on(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id)
                        .and(registeredVehiclePhoto.id.eq(
                                jpaQueryFactory.select(registeredVehiclePhoto.id.max())
                                        .from(registeredVehiclePhoto)
                                        .where(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id))
                        )))
                .where(registeredVehicle.users.id.eq(userId))
                .orderBy(registeredVehicle.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(registeredVehicle.count())
                .from(registeredVehicle)
                .where(registeredVehicle.users.id.eq(userId))
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    // 최근 등록 차량 조회
    public List<RegisteredVehicleCardResponse> findLatestRegisteredVehicle() {
        QRegisteredVehicle registeredVehicle = QRegisteredVehicle.registeredVehicle;
        QRegisteredVehiclePhoto registeredVehiclePhoto = QRegisteredVehiclePhoto.registeredVehiclePhoto;

        return jpaQueryFactory
                .select(Projections.constructor(RegisteredVehicleCardResponse.class,
                        registeredVehicle.id,
                        registeredVehicle.users.id,
                        registeredVehicle.users.username,
                        registeredVehicle.manufacturer,
                        registeredVehicle.releaseYear,
                        registeredVehicle.mileage,
                        registeredVehicle.sellingPrice,
                        registeredVehiclePhoto.fileUrl,
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .leftJoin(registeredVehiclePhoto)
                .on(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id)
                    .and(registeredVehiclePhoto.id.eq(
                        jpaQueryFactory.select(registeredVehiclePhoto.id.max())
                                .from(registeredVehiclePhoto)
                                .where(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id))
                    )))
                .orderBy(registeredVehicle.createdAt.desc())
                .limit(2)
                .fetch();
    }

    // 고가 차량 조회
    public List<RegisteredVehicleCardResponse> findHighPriceVehicles() {
        QRegisteredVehicle registeredVehicle = QRegisteredVehicle.registeredVehicle;
        QRegisteredVehiclePhoto registeredVehiclePhoto = QRegisteredVehiclePhoto.registeredVehiclePhoto;

        return jpaQueryFactory
                .select(Projections.constructor(RegisteredVehicleCardResponse.class,
                        registeredVehicle.id,
                        registeredVehicle.users.id,
                        registeredVehicle.users.username,
                        registeredVehicle.manufacturer,
                        registeredVehicle.releaseYear,
                        registeredVehicle.mileage,
                        registeredVehicle.sellingPrice,
                        registeredVehiclePhoto.fileUrl,
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .leftJoin(registeredVehiclePhoto)
                .on(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id)
                        .and(registeredVehiclePhoto.id.eq(
                                jpaQueryFactory.select(registeredVehiclePhoto.id.max())
                                        .from(registeredVehiclePhoto)
                                        .where(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id))
                        )))
                .orderBy(registeredVehicle.sellingPrice.desc())
                .limit(4)
                .fetch();
    }

    // 전체 or 무사고 or 무도색 or 무사고 & 무도색 조회 (페이징)
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByCondition(
            Boolean noAccident, Boolean noPaint, Pageable pageable) {
        QRegisteredVehicle registeredVehicle = QRegisteredVehicle.registeredVehicle;
        QRegisteredVehiclePhoto registeredVehiclePhoto = QRegisteredVehiclePhoto.registeredVehiclePhoto;

        List<RegisteredVehicleCardResponse> content = jpaQueryFactory
                .select(Projections.constructor(RegisteredVehicleCardResponse.class,
                        registeredVehicle.id,
                        registeredVehicle.users.id,
                        registeredVehicle.users.username,
                        registeredVehicle.manufacturer,
                        registeredVehicle.releaseYear,
                        registeredVehicle.mileage,
                        registeredVehicle.sellingPrice,
                        registeredVehiclePhoto.fileUrl,
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .leftJoin(registeredVehiclePhoto)
                .on(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id)
                        .and(registeredVehiclePhoto.id.eq(
                                jpaQueryFactory.select(registeredVehiclePhoto.id.max())
                                        .from(registeredVehiclePhoto)
                                        .where(registeredVehiclePhoto.registeredVehicle.id.eq(registeredVehicle.id))
                        )))
                .where(
                        noAccident ? registeredVehicle.accidentInfo.isEmpty()
                                .or(registeredVehicle.accidentInfo.contains(AccidentInfoEnum.NONE)
                                        .and(registeredVehicle.accidentInfo.size().eq(1))) : null,
                        noPaint ? registeredVehicle.repainted.eq(RepaintedEnum.NOT_REPAINTED)
                                .or(registeredVehicle.repainted.eq(Expressions.nullExpression())) : null
                )
                .orderBy(registeredVehicle.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(registeredVehicle.count())
                .from(registeredVehicle)
                .where(
                        noAccident ? registeredVehicle.accidentInfo.isEmpty()
                                .or(registeredVehicle.accidentInfo.contains(AccidentInfoEnum.NONE)
                                        .and(registeredVehicle.accidentInfo.size().eq(1))) : null,
                        noPaint ? registeredVehicle.repainted.eq(RepaintedEnum.NOT_REPAINTED)
                                .or(registeredVehicle.repainted.eq(Expressions.nullExpression())) : null
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    // 미완성 "등록 차량" 조회
    public List<RegisterVehicleInProgressCardResponse> findRegisterVehicleInProgressCard(Long userId) {
        QRegisteredVehicle registeredVehicle = QRegisteredVehicle.registeredVehicle;

        return jpaQueryFactory
                .select(Projections.constructor(RegisterVehicleInProgressCardResponse.class,
                        registeredVehicle.id,
                        registeredVehicle.users.id,
                        registeredVehicle.users.username,
                        Expressions.constant(0), // registeredVehicle.progressStep,
                        Expressions.constant(0), // registeredVehicle.progressTotalSteps,
                        registeredVehicle.manufacturer,
                        registeredVehicle.releaseYear,
                        registeredVehicle.mileage,
                        registeredVehicle.sellingPrice,
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .where(registeredVehicle.users.id.eq(userId))
                .orderBy(registeredVehicle.createdAt.desc())
                .fetch();
    }
}
