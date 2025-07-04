package dev.kimbank.iload.domain.vehicle.repository;

import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegisteredVehicleRepository extends JpaRepository<RegisteredVehicle, Long> {
}