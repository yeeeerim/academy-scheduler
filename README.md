## 배포 URL
https://www.giant-edu.com/

## 명령어

```
yarn fetch:account
```

- 로컬 환경에서 Spread Sheet의 회원 정보를 가져오기 위한 명령어입니다.
- 라이브 환경에서는 Vercel 에서 build 명령어를 통해 패치된 후 배포됩니다. (다른 데이터는 실시간 적용이지만, 회원정보는 배포 시 적용)
- /tmp 폴더에 회원 정보가 json 형태로 저장되며, 서버상에서만 저장되기 때문에 개발자와 사용자는 확인할 수 없습니다.
