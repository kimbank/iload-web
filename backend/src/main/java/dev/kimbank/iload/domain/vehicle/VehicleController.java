package dev.kimbank.iload.domain.vehicle;

import dev.kimbank.iload.domain.vehicle.dto.*;
import dev.kimbank.iload.domain.vehicle.entity.*;
import dev.kimbank.iload.global.security.AuthedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
@Validated
@Tag(name="Vehicle", description = "차량 관련 API")
class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping("/my")
    @Operation(summary = "사용자 차량 목록 조회",
            description = "사용자의 차량 등록 목록을 조회합니다. 차량 등록이 없는 경우 빈 목록을 반환합니다.")
    public Page<RegisteredVehicleCardResponse> getMyVehicleCards(
            @AuthedUser Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return vehicleService.getMyVehicleCards(userId, pageable);
    }

    @DeleteMapping("/my")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "사용자 차량 삭제",
            description = "사용자의 차량 등록을 ID로 삭제합니다. 차량 등록이 없는 경우 404 에러를 반환합니다.")
    public void deleteMyVehicle(
            @AuthedUser Long userId,
            @RequestParam @NotNull @Positive Long id) {
        vehicleService.deleteMyVehicle(userId, id);
    }

    @GetMapping("/in-progress-cards")
    @Operation(summary = "미완성 차량 등록 카드 조회",
            description = "사용자가 미완성 상태로 남긴 차량 등록 카드 목록을 조회합니다.")
    public List<RegisterVehicleInProgressCardResponse> getRegisterVehicleInProgressCard(
            @AuthedUser Long userId) {
        return vehicleService.getRegisterVehicleInProgressCard(userId);
    }

    @DeleteMapping("/in-progress-card")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "미완성 차량 등록 카드 삭제",
            description = "사용자가 미완성 상태로 남긴 차량 등록 카드를 삭제합니다.")
    public void deleteRegisterVehicleInProgressCard(
            @AuthedUser Long userId,
            @RequestParam @NotNull @Positive Long id) {
        vehicleService.deleteRegisterVehicleInProgressCard(userId, id);
    }

    @PostMapping("/create-empty")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "비어있는 차량 등록 생성",
            description = "사용자의 ID를 기반으로 비어있는 차량 등록을 생성합니다.")
    public Long createEmptyRegisteredVehicle(
            @AuthedUser Long userId) {
        return vehicleService.createEmptyRegisteredVehicle(userId);
    }

    @GetMapping
    @Operation(summary = "차량 등록 상세 조회",
            description = "차량 등록 ID를 기반으로 차량 등록의 상세 정보를 조회합니다.")
    public RegisteredVehicle getRegisteredVehicle(
            @AuthedUser Long userId,
            @RequestParam @NotNull @Positive Long id) {
        return vehicleService.getRegisteredVehicle(userId, id);
    }

    @PutMapping("/basic-info")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "차량 등록 기본 정보 업데이트",
            description = "차량 등록 ID와 사용자 ID를 기반으로 차량 등록의 기본 정보를 업데이트합니다.")
    public void updateRegisteredVehicleBasicInfo(
            @AuthedUser Long userId,
            @RequestParam @NotNull Long id,
            @RequestBody @Valid VehicleRegistrationBasicInfoRequest request) {
        vehicleService.updateRegisteredVehicleBasicInfo(userId, id, request);
    }

    @PutMapping("/etc-info")
    @Operation(summary = "차량 등록 기타 정보 업데이트",
            description = "차량 등록 ID와 사용자 ID를 기반으로 차량 등록의 기타 정보를 업데이트합니다.")
    public void updateRegisteredVehicleEtcInfo(
            @AuthedUser Long userId,
            @RequestParam @NotNull Long id,
            @RequestBody @Valid VehicleRegistrationEtcInfoRequest request) {
        vehicleService.updateRegisteredVehicleEtcInfo(userId, id, request);
    }
}
