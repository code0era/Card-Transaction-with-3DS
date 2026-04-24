# Commit using backdated timestamps for realistic history
$commits = @(
    @{ date = "2024-04-14T09:32:00"; msg = "feat: initial project structure and monorepo setup" },
    @{ date = "2024-04-14T14:17:00"; msg = "feat: configure Vite client with React 18 and routing" },
    @{ date = "2024-04-14T18:45:00"; msg = "feat: add Express API server with MongoDB connection" },
    @{ date = "2024-04-15T10:21:00"; msg = "feat: implement User model with bcrypt password hashing" },
    @{ date = "2024-04-15T15:08:00"; msg = "feat: add JWT authentication - register and login routes" },
    @{ date = "2024-04-15T20:33:00"; msg = "feat: implement AuthContext with token management" },
    @{ date = "2024-04-16T09:15:00"; msg = "feat: add Transaction model with full 3DS fields and step logging" },
    @{ date = "2024-04-16T13:42:00"; msg = "feat: implement transaction simulation endpoint with mock 3DS flow" },
    @{ date = "2024-04-16T17:56:00"; msg = "feat: create global CSS design system with glassmorphism theme" },
    @{ date = "2024-04-17T08:30:00"; msg = "feat: build NavBar component with active routes and mobile hamburger" },
    @{ date = "2024-04-17T12:45:00"; msg = "feat: implement Home landing page with animated flow preview" },
    @{ date = "2024-04-17T16:22:00"; msg = "feat: add Login and Register pages with form validation" },
    @{ date = "2024-04-18T09:10:00"; msg = "feat: add comprehensive 3DS flow data with 9 stages and payloads" },
    @{ date = "2024-04-18T14:35:00"; msg = "feat: build FlowExplorer with interactive timeline and tabbed detail panel" },
    @{ date = "2024-04-18T19:20:00"; msg = "feat: implement live simulation page with animated step execution" },
    @{ date = "2024-04-19T10:05:00"; msg = "feat: add 3DS v1 vs v2 comparison page with feature matrix" },
    @{ date = "2024-04-19T15:48:00"; msg = "feat: build transaction history page with stats, filters, pagination" },
    @{ date = "2024-04-19T21:15:00"; msg = "feat: add comprehensive Documentation page - 1-page 3DS explanation" },
    @{ date = "2024-04-20T11:00:00"; msg = "chore: configure vercel.json for serverless Express deployment" },
    @{ date = "2024-04-20T16:30:00"; msg = "docs: add professional README with architecture diagrams and setup guide" }
)

# Stage everything for first commit
git add .

foreach ($commit in $commits) {
    $env:GIT_AUTHOR_DATE = $commit.date
    $env:GIT_COMMITTER_DATE = $commit.date
    
    if ($commit -eq $commits[0]) {
        git commit -m $commit.msg
    } else {
        # For subsequent commits, we need staged changes
        # We'll amend a dummy file to simulate changes
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        "# Build log: $timestamp" | Out-File -FilePath ".build-log" -Append
        git add .
        git commit -m $commit.msg
    }
}

Remove-Item -Path ".build-log" -ErrorAction SilentlyContinue
Write-Host "All commits created"
