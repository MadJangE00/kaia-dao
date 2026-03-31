# KAIA DAO - 프로젝트 개요 및 작업 계획

## 프로젝트 소개

**KAIA DAO**는 Kaia 블록체인 네트워크 기반의 탈중앙화 커뮤니티 플랫폼입니다.
사용자는 그룹을 만들고, 투표하고, 승부를 예측하고, 토큰/NFT를 발행하며 거래할 수 있습니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16.2, React 19, TypeScript, TailwindCSS |
| 블록체인 | Solidity 0.8.27, Hardhat 3, ethers.js, wagmi, viem |
| 인증 | Privy (Google 로그인 + MetaMask 지갑 연결) |
| 데이터베이스 | Supabase (미구성) |
| 파일 저장소 | Pinata (IPFS) |
| 상태 관리 | TanStack React Query |
| 네트워크 | Kaia Mainnet (8217) / Kairos Testnet (1001) |

---

## 프로젝트 구조

```
dao/
├── contracts/                # Solidity 스마트 컨트랙트
│   ├── governance/
│   │   ├── GroupManager.sol  # 그룹 생성/가입/탈퇴
│   │   └── Voting.sol        # 제안 생성 및 투표
│   ├── token/
│   │   ├── TokenFactory.sol  # ERC20 토큰 발행 팩토리
│   │   └── CustomToken.sol   # ERC20 토큰 구현체
│   ├── nft/
│   │   ├── CommunityNFT.sol  # ERC721 NFT 발행
│   │   └── NFTMarketplace.sol# NFT 거래 마켓플레이스 (수수료 2.5%)
│   └── prediction/
│       └── PredictionMarket.sol # 승부 예측 베팅 (수수료 2%)
│
├── src/
│   ├── app/
│   │   ├── page.tsx          # 랜딩 페이지
│   │   ├── (auth)/login/     # 로그인 페이지
│   │   └── (dashboard)/      # 인증 필요 영역
│   │       ├── feed/         # 소셜 피드
│   │       ├── groups/       # 그룹 목록/생성/상세
│   │       ├── vote/         # 투표 목록/생성/상세
│   │       └── predict/      # 예측 목록/생성/상세
│   │
│   ├── components/
│   │   ├── auth/             # AuthGuard, LoginButton
│   │   ├── layout/           # Navbar, Header, Sidebar
│   │   └── ui/               # Button, Card, Badge, Input, Tabs
│   │
│   ├── hooks/                # 스마트 컨트랙트 연동 훅
│   │   ├── useGroups.ts      # 그룹 CRUD
│   │   ├── useVoting.ts      # 투표 생성/참여/종료
│   │   ├── usePrediction.ts  # 예측 생성/베팅/정산
│   │   ├── useTokenFactory.ts# 토큰 발행/전송
│   │   └── useNFT.ts         # NFT 발행/마켓플레이스
│   │
│   ├── config/               # 체인, Privy, wagmi, 컨트랙트 주소
│   ├── lib/                  # 유틸리티, Pinata, Supabase, ABI
│   ├── providers/            # PrivyProvider + WagmiProvider + QueryClient
│   └── types/                # TypeScript 타입 정의
│
├── supabase/migrations/      # (비어 있음)
├── scripts/                  # (비어 있음)
├── test/                     # (비어 있음)
├── hardhat.config.ts         # Hardhat 설정 (Kairos/Kaia 네트워크)
└── package.json
```

---

## 현재 구현 상태

### 완료된 기능

| 기능 | 컨트랙트 | 프론트엔드 | 훅 |
|------|:--------:|:----------:|:--:|
| 그룹 생성/가입/탈퇴 | O | O | O |
| 제안 생성/투표/종료 | O | O | O |
| 승부 예측/베팅/정산 | O | O | O |
| ERC20 토큰 발행/전송 | O | X | O |
| NFT 발행 | O | X (피드에서 버튼만 존재) | O |
| NFT 마켓플레이스 | O | X | O |
| 인증 (Google + MetaMask) | - | O | - |
| 랜딩 페이지 | - | O | - |
| 대시보드 레이아웃/사이드바 | - | O | - |

### 미구현 페이지 (사이드바에 링크는 있으나 페이지 없음)

- `/token` - 토큰 발행/관리 페이지
- `/nft` - NFT 마켓플레이스 페이지
- `/gallery` - NFT 갤러리 페이지
- `/profile` - 사용자 프로필 페이지

---

## 앞으로 할 작업

### Phase 1: 미구현 페이지 완성

#### 1-1. 토큰 페이지 (`/token`)
- [ ] 토큰 생성 폼 (이름, 심볼, 초기 발행량)
- [ ] 내가 만든 토큰 목록 표시
- [ ] 토큰 전송 기능 (수신자 주소, 수량 입력)
- [ ] 토큰 잔액 조회

#### 1-2. NFT 마켓플레이스 페이지 (`/nft`)
- [ ] NFT 마켓 리스팅 목록 (가격, 판매자 정보)
- [ ] NFT 구매 기능
- [ ] 내 NFT 판매 등록 (가격 설정)
- [ ] 판매 취소 기능

#### 1-3. NFT 갤러리 페이지 (`/gallery`)
- [ ] 내가 보유한 NFT 그리드 표시
- [ ] NFT 메타데이터 (이미지, 이름, 설명) 로딩
- [ ] NFT 발행(민팅) 기능 (이미지 업로드 -> Pinata IPFS -> 민팅)
- [ ] 갤러리에서 마켓플레이스로 판매 등록 연결

#### 1-4. 프로필 페이지 (`/profile`)
- [ ] 지갑 주소 및 KAIA 잔액 표시
- [ ] 활동 요약 (그룹 수, 투표 참여 수, 보유 NFT 수 등)
- [ ] 내 토큰/NFT 요약 보기

### Phase 2: 기존 기능 보강

#### 2-1. 피드 기능 개선
- [ ] 게시글 영속 저장 (Supabase 연동)
- [ ] 이미지 첨부 기능 (Pinata 업로드)
- [ ] 게시글 -> NFT 발행 플로우 완성

#### 2-2. Supabase 데이터베이스 설정
- [ ] 마이그레이션 스키마 작성 (users, posts, groups 메타 등)
- [ ] 온체인 데이터와 오프체인 데이터 역할 분리 설계
- [ ] 서버 컴포넌트에서 Supabase 데이터 조회

### Phase 3: 스마트 컨트랙트 배포 및 테스트

#### 3-1. 테스트 작성
- [ ] GroupManager 단위 테스트
- [ ] Voting 단위 테스트
- [ ] PredictionMarket 단위 테스트
- [ ] TokenFactory 단위 테스트
- [ ] CommunityNFT + NFTMarketplace 단위 테스트

#### 3-2. 배포 스크립트
- [ ] Hardhat Ignition 모듈 작성
- [ ] Kairos 테스트넷 배포 스크립트
- [ ] 배포 후 컨트랙트 주소 `.env`에 자동 기록
- [ ] Kaiascan 컨트랙트 검증

### Phase 4: 추가 개선사항

- [ ] 반응형 모바일 UI 최적화
- [ ] 에러 핸들링 및 트랜잭션 상태 표시 (pending/success/fail 토스트)
- [ ] 환경변수 `.env.example` 파일 작성
- [ ] SEO 및 메타 태그 보강
- [ ] 다국어 지원 (한국어/영어)

---

## 환경변수 (필요)

```env
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Pinata (IPFS)
PINATA_JWT=
NEXT_PUBLIC_PINATA_GATEWAY=

# Smart Contract Addresses (배포 후 설정)
NEXT_PUBLIC_GROUP_MANAGER_ADDRESS=
NEXT_PUBLIC_VOTING_ADDRESS=
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=
NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=
NEXT_PUBLIC_COMMUNITY_NFT_ADDRESS=
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=

# Deployer (배포용, 프론트엔드 불필요)
DEPLOYER_PRIVATE_KEY=
```

---

## 참고사항

- 스마트 컨트랙트는 OpenZeppelin 5.x 기반으로 작성됨
- NFT 마켓플레이스 수수료: 2.5%, 승부 예측 수수료: 2%
- 투표 기간: 최소 1시간 ~ 최대 30일
- 예측 마켓 옵션: 최소 2개 ~ 최대 10개
- 다른 사용자 갤러리 방문 기능은 현재 보류 상태
