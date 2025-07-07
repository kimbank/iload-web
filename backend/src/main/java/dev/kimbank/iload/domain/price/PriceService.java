package dev.kimbank.iload.domain.price;

import dev.kimbank.iload.domain.price.dto.PriceDetailResponse;
import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import dev.kimbank.iload.domain.vehicle.repository.RegisteredVehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class PriceService {
    private final RegisteredVehicleRepository registeredVehicleRepository;

    @Value("${spring.s3.endpoint}")
    private String s3Endpoint;

    // 가격 상세 정보 조회
    public PriceDetailResponse getPriceDetails(Long vehicleId) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        return PriceDetailResponse.from(vehicle, s3Endpoint);
    }
}
