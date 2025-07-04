package dev.kimbank.iload.domain.vehicle.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import dev.kimbank.iload.domain.vehicle.dto.*;
import dev.kimbank.iload.domain.vehicle.entity.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VehicleQueryRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public VehicleQueryRepository(EntityManager entityManager) {
        this.jpaQueryFactory = new JPAQueryFactory(entityManager);
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
                        Projections.list(Projections.constructor(RegisteredVehicleCardResponse.RegisteredVehiclePhotoDto.class,
                                registeredVehiclePhoto.photoUrl
                        )),
                        registeredVehicle.createdAt,
                        registeredVehicle.updatedAt
                ))
                .from(registeredVehicle)
                .leftJoin(registeredVehicle.registeredVehiclePhotos, registeredVehiclePhoto)
                .orderBy(registeredVehicle.createdAt.desc())
                .limit(2)
                .fetch();
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
