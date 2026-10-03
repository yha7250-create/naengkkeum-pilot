# Netlify 배포 방법

## GitHub 저장소 구조 확인

GitHub 저장소 첫 화면에 다음 파일이 바로 보여야 합니다.

- `package.json`
- `pnpm-lock.yaml`
- `netlify.toml`
- `index.html`
- `src` 폴더

저장소 첫 화면에 `DormMeal-main` 폴더 하나만 보이고 위 파일들이 그 안에 들어 있다면, Netlify의 **Base directory**를 `DormMeal-main`으로 지정해야 합니다. 가장 안전한 방법은 `DormMeal-main` 안의 파일들을 저장소 최상위로 옮기는 것입니다.

## GitHub 저장소 연결 배포

`netlify.toml`이 다음 값을 자동으로 지정합니다.

- Build command: `pnpm build`
- Publish directory: `dist`
- Node.js: 22

Netlify에서 기존 사이트를 GitHub 저장소에 연결한 뒤 **Deploy site** 또는 **Trigger deploy → Clear cache and deploy site**를 실행합니다.

## 수동 드래그 배포

소스 전체를 Netlify Deploys 화면에 드래그하면 안 됩니다. 로컬에서 `pnpm build`를 실행한 뒤 생성되는 `dist` 폴더만 드래그해야 합니다.

## 빈 화면이 계속되는 경우

Netlify 배포 로그에서 아래 두 줄을 확인합니다.

```text
Command: pnpm build
Publish directory: dist
```

브라우저 개발자 도구에 `/src/main.tsx` 관련 오류가 나타난다면 소스 폴더가 그대로 게시된 것입니다. `/assets/index-....js`가 404라면 Publish directory 또는 저장소 Base directory가 잘못된 것입니다.
