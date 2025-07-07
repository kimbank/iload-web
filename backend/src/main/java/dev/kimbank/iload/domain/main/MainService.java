package dev.kimbank.iload.domain.main;

import dev.kimbank.iload.domain.vehicle.dto.RegisteredVehicleCardResponse;
import dev.kimbank.iload.domain.vehicle.repository.VehicleQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
class MainService {
    private final VehicleQueryRepository vehicleQueryRepository;

    @Value("${spring.s3.endpoint}")
    private String s3Endpoint;

    // 메인 페이지에서 최근 등록된 차량 카드 조회
    public List<RegisteredVehicleCardResponse> findLatestRegisteredVehicles() {
        return vehicleQueryRepository.findLatestRegisteredVehicle()
                .stream()
                .map(card -> RegisteredVehicleCardResponse.from(card, s3Endpoint))
                .toList();
    }

    // 메인 페이지에서 고가 차량 카드 조회
    public List<RegisteredVehicleCardResponse> findHighPriceVehicles() {
        return vehicleQueryRepository.findHighPriceVehicles()
                .stream()
                .map(card -> RegisteredVehicleCardResponse.from(card, s3Endpoint))
                .collect(toList());
    }

    // 메인 페이지에서 조건에 맞는 차량 카드 조회 (페이징)
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByCondition(
            Boolean noAccident, Boolean noPaint, Pageable pageable) {
        return vehicleQueryRepository.findRegisteredVehicleCardsByCondition(noAccident, noPaint, pageable)
                .map(card -> RegisteredVehicleCardResponse.from(card, s3Endpoint));
    }
}
