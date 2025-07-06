package dev.kimbank.iload.domain.main;

import dev.kimbank.iload.domain.vehicle.dto.RegisteredVehicleCardResponse;
import dev.kimbank.iload.domain.vehicle.repository.VehicleQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
class MainService {
    private final VehicleQueryRepository vehicleQueryRepository;

    // 메인 페이지에서 최근 등록된 차량 카드 조회
    public List<RegisteredVehicleCardResponse> findLatestRegisteredVehicles() {
        return vehicleQueryRepository.findLatestRegisteredVehicle();
    }

    // 메인 페이지에서 고가 차량 카드 조회
    public List<RegisteredVehicleCardResponse> findHighPriceVehicles() {
        return vehicleQueryRepository.findHighPriceVehicles();
    }

    // 메인 페이지에서 조건에 맞는 차량 카드 조회 (페이징)
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByCondition(
            Boolean noAccident, Boolean noPaint, Pageable pageable) {
        return vehicleQueryRepository.findRegisteredVehicleCardsByCondition(noAccident, noPaint, pageable);
    }
}
