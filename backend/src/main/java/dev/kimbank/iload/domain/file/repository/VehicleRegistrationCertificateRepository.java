package dev.kimbank.iload.domain.file.repository;

import dev.kimbank.iload.domain.file.entity.VehicleRegistrationCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleRegistrationCertificateRepository extends JpaRepository<VehicleRegistrationCertificate, Long> {
    List<VehicleRegistrationCertificate> findByRegisteredVehicleId(Long vehicleId);

    @Modifying
    @Query("DELETE FROM VehicleRegistrationCertificate c WHERE c.id = :certificateId")
    int deleteByCertificateId(@Param("certificateId") Long certificateId);
}
