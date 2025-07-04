package dev.kimbank.iload.domain.vehicle.repository;

import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehiclePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegisteredVehiclePhotoRepository extends JpaRepository<RegisteredVehiclePhoto, Long> {
}