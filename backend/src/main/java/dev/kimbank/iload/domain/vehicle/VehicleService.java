package dev.kimbank.iload.domain.vehicle;

import dev.kimbank.iload.domain.users.UsersRepository;
import dev.kimbank.iload.domain.users.entity.Users;
import dev.kimbank.iload.domain.vehicle.dto.*;
import dev.kimbank.iload.domain.vehicle.entity.*;
import dev.kimbank.iload.domain.vehicle.repository.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
class VehicleService {
    private final VehicleQueryRepository vehicleQueryRepository;
    private final RegisteredVehicleRepository registeredVehicleRepository;
    private final UsersRepository usersRepository;
    private final ModelMapper modelMapper;

    @Value("${spring.s3.endpoint}")
    private String s3Endpoint;

    // 사용자 차량 목록 조회
    public Page<RegisteredVehicleCardResponse> getMyVehicleCards(Long userId, Pageable pageable) {
        return vehicleQueryRepository
                .findRegisteredVehicleCardsByUserId(userId, pageable)
                .map(card -> RegisteredVehicleCardResponse.from(card, s3Endpoint));
    }

    public void deleteMyVehicle(Long userId, Long id) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + id));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(vehicle, userId);

        registeredVehicleRepository.delete(vehicle);
    }

    // 비어있는 "등록 차량" 생성
    public Long createEmptyRegisteredVehicle(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없음: " + userId));

        RegisteredVehicle vehicle = new RegisteredVehicle();
        vehicle.setUsers(user);

        registeredVehicleRepository.save(vehicle);

        return vehicle.getId();
    }

    // 차량 등록 페이지에서 미완성된 "등록 차량" 목록 조회
    public List<RegisterVehicleInProgressCardResponse> getRegisterVehicleInProgressCard(Long userId) {
        List<RegisterVehicleInProgressCardResponse> vehicles = vehicleQueryRepository
                .findRegisterVehicleInProgressCard(userId);

        // 각 차량에 대해 진행 단계 및 총 단계를 설정
        for (RegisterVehicleInProgressCardResponse vehicle : vehicles) {
            vehicle.setProgressStep(1);
            vehicle.setProgressTotalSteps(3);
        }

        return vehicles;
    }

    // 미완성 차량 등록 카드 삭제
    public void deleteRegisterVehicleInProgressCard(Long userId, Long id) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + id));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(vehicle, userId);

        registeredVehicleRepository.delete(vehicle);
    }

    // "등록 차량" 상세 조회
    public RegisteredVehicle getRegisteredVehicle(Long userId, Long vehicleId) {
        RegisteredVehicle vehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(vehicle, userId);

        return vehicle;
    }

    // "등록 차량" 기본 정보 업데이트
    public void updateRegisteredVehicle(Long userId, Long vehicleId) {
        RegisteredVehicle existingVehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(existingVehicle, userId);

        registeredVehicleRepository.save(existingVehicle);
    }

    // "등록 차량" 기타 정보 업데이트
    public void updateRegisteredVehicleBasicInfo(Long userId, Long vehicleId,
            VehicleRegistrationBasicInfoRequest request) {
        RegisteredVehicle existingVehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(existingVehicle, userId);

        modelMapper.map(request, existingVehicle);

        registeredVehicleRepository.save(existingVehicle);
    }

    // "등록 차량" 기타 정보 업데이트
    public void updateRegisteredVehicleEtcInfo(Long userId, Long vehicleId,
            VehicleRegistrationEtcInfoRequest request) {
        RegisteredVehicle existingVehicle = registeredVehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("등록 차량을 찾을 수 없음: " + vehicleId));

        // 차량이 해당 유저의 차량인지 확인
        validateOwnership(existingVehicle, userId);

        modelMapper.map(request, existingVehicle);

        registeredVehicleRepository.save(existingVehicle);
    }

    private void validateOwnership(RegisteredVehicle vehicle, Long userId) {
        if (!vehicle.getUsers().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 차량에 대한 권한이 없습니다.");
        }
    }
}
