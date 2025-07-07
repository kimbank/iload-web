package dev.kimbank.iload.domain.file.repository;

import dev.kimbank.iload.domain.file.entity.RegisteredVehiclePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegisteredVehiclePhotoRepository extends JpaRepository<RegisteredVehiclePhoto, Long> {
    List<RegisteredVehiclePhoto> findByRegisteredVehicleId(Long vehicleId);

    @Modifying
    @Query("DELETE FROM RegisteredVehiclePhoto p WHERE p.id = :photoId")
    int deleteByPhotoId(@Param("photoId") Long photoId);
}
