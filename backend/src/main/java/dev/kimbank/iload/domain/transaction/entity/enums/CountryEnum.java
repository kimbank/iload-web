package dev.kimbank.iload.domain.transaction.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CountryEnum {
    // 아랍에미레이트
    UAE("UAE", "아랍에미레이트"),
    // 가봉
    GABON("GABON", "가봉"),
    // 리투아니아
    LITHUANIA("LITHUANIA", "리투아니아"),
    // 사우디아라비아
    SAUDI_ARABIA("SAUDI_ARABIA", "사우디아라비아"),
    // 아제르바이잔
    AZERBAIJAN("AZERBAIJAN", "아제르바이잔"),
    // 우즈베키스탄
    UZBEKISTAN("UZBEKISTAN", "우즈베키스탄"),
    // 우크라이나
    UKRAINE("UKRAINE", "우크라이나"),
    // 이집트
    EGYPT("EGYPT", "이집트"),
    // 조지아
    GEORGIA("GEORGIA", "조지아"),
    // 카자흐스탄
    KAZAKHSTAN("KAZAKHSTAN", "카자흐스탄"),
    // 키르기스스탄
    KYRGYZSTAN("KYRGYZSTAN", "키르기스스탄"),
    // 타지키스탄
    TAJIKISTAN("TAJIKISTAN", "타지키스탄"),
    // 토고
    TOGO("TOGO", "토고"),
    // 러시아
    RUSSIA("RUSSIA", "러시아");

    private final String code;
    private final String description;
}
