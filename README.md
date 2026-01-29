# 오즈코딩스쿨 가이드 문서 : `Axios` 예시 프로젝트

`Axios instance`를 활용한 프로젝트입니다.

실제로 요청을 하기 위해서는 각 인스턴스의 `BASE_URL`을 실제 존재하는 주소로 수정해야 합니다.

요청/응답을 확인하기 위해서는 `npm run dev`로 실행중인 브라우저에서 `f12` 키를 통해 `개발자 도구` > `network` 탭으로 가시면 됩니다.

## simple_pattern_api : Axios instance

가장 간단히 구성한 예시입니다.

커스텀 훅을 활용한 예시가 들어있습니다.

## factory_pattern_api : authAPI, defaultAPI, externalAPI

팩토리 패턴을 사용한 예시입니다.

인증/외부/미설정 3가지 예시로 쪼개 인스턴스를 생성했습니다.
