package dev.kimbank.iload.domain.vehicle.repository;

import dev.kimbank.iload.domain.vehicle.entity.VehicleRegistrationCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRegistrationCertificateRepository extends JpaRepository<VehicleRegistrationCertificate, Long> {
}