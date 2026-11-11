---
title: "운전자 인증 기반 차량 HMI"
description: "얼굴 인증, 차량 제어, 센서 모니터링과 이력 관리를 Qt HMI로 연결했습니다."
date: "2026-11-11 00:00:00 +0900"
categories: ["GUI 응용 소프트웨어"]
tags: ["C++", "Qt", "OpenCV", "SQLite"]
permalink: "/projects/vehicle-hmi.html"
toc: true
comments: false
period: "2026.08.14 ~ 2026.08.19"
people: "4명 (본인 포함)"
project_type: "팀 프로젝트"
project_number: 4
---

## 프로젝트 개요

운전자 얼굴을 확인한 뒤 차량 조작을 활성화하고, 온습도·거리·주행 상태를 보여주는 PC 기반 차량 HMI 시스템입니다. STM32와 UART로 명령과 상태 데이터를 주고받습니다.

## 담당 역할

Qt GUI, 카메라 영상 처리, 얼굴 인증, UART 송수신 및 SQLite 이력 관리를 포함한 PC 측 프로그램을 담당했습니다.

> STM32 펌웨어는 팀원이 구현했습니다. PC의 명령 전송 구현과 MCU의 실제 구동 검증은 구분합니다.
{: .prompt-info }

## 시스템 구조

| 순서 | 구성 요소 |
| --- | --- |
| 1 | 카메라 획득 |
| 2 | 얼굴 인증·영상 표시 |
| 3 | Qt HMI |
| 4 | UART / STM32 |

## 구현 내용

### 운전자 인증

Haar Cascade·LBPH를 이용하고 동일 인물을 5회 연속 확인한 뒤 조작을 활성화합니다.

### 영상 처리 구조

카메라 획득·표시·인식 스레드를 분리합니다.

### 차량 통신

SerialLink로 UART 송수신을 관리하고 200ms 하트비트를 전송합니다.

### 상태·이력 관리

센서 상태를 표시하고 UI 스레드에서 SQLite 이력을 저장·조회합니다.

## 핀맵·통신 규격

| 연결 대상 | 인터페이스 | 용도 |
| --- | --- | --- |
| PC ↔ STM32 | UART | 차량 조작 명령, 센서·주행 상태, 하트비트 |
| 카메라 → PC | 영상 입력 | 동일 프레임을 표시·인식 처리에 활용 |
| PC 내부 | SQLite | 인증·운전자 관련 이력 관리 |

상세 핀 번호와 전압 조건은 최종 회로·배선 확인 후 추가합니다.

## 트러블슈팅

문제 발생 당시의 증상과 점검 과정, 수정 내용 및 확인 결과를 정리해 추가할 예정입니다.

## 검증·시연

인증 전 명령 전송을 차단하고, 동일 인물의 연속 확인 후 조작을 활성화하는 흐름을 구현했습니다. 실제 장치의 통합 시연과 시험 조건은 별도 자료를 추가해 설명할 예정입니다.

## 참고 자료

- [PC 프로그램 저장소](https://github.com/Kevin-jwd/HMI-qt)
- [얼굴 인증 가이드](https://github.com/Kevin-jwd/HMI-qt/blob/main/FACE_RECOGNITION_GUIDE.md)
- [데이터베이스 구조](https://github.com/Kevin-jwd/HMI-qt/blob/main/DATABASE.md)
- [설치·실행 안내](https://github.com/Kevin-jwd/HMI-qt/blob/main/INSTALL.md)
