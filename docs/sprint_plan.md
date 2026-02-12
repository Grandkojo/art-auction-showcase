## Product Vision

- **Vision**: Create a simple website where artists can showcase their art so interested parties can view and buy when auctioned.

## Product Backlog (User Stories)

1. **Story One – Add Art (Artist)**
   - **As an** artist  
   - **I want** to be able to add my art to showcase  
   - **So that** others can view and submit a proposal to buy  
   - **Acceptance Criteria**:  
     - A modal/form to add art images, stock quantity, and prices  
     - View art as part of the artist's collection  
   - **Story Points**: 1

2. **Story Two – Browse & Buy (Interested Party)**
   - **As an** interested party  
   - **I want** to be able to see the list of all arts  
   - **So that** I can select my preferred choice to buy  
   - **Acceptance Criteria**:  
     - Page that shows all published arts with prices and stock quantity  
     - Page/section that shows a specific art with related detail when selected  
     - Button to make payment when the interested party is ready to buy (simple simulated payment)  
   - **Story Points**: 2

3. **Story Three – View Sales (Artist)**
   - **As an** artist  
   - **I want** to be able to view all my past sales/auctions  
   - **So that** I can evaluate my sales and how I am doing in the business  
   - **Acceptance Criteria**:  
     - Simple graphs/statistics that show total sales and revenue since joining the app  
     - List of all individual sales with timestamp for analysis  
   - **Story Points**: 1

4. **Story Four – Saved Arts (Interested Party)**
   - **As an** interested party  
   - **I want** to be able to see all arts I have saved in the past 15 days  
   - **So that** I can easily find the art to purchase when I make the decision  
   - **Acceptance Criteria**:  
     - Page/section to see saved arts in the last 15 days  
     - Button to remove existing saved arts  
     - Button to make payment when I am ready (simple simulated payment)  
   - **Story Points**: 1

5. **Story Five – Admin Moderation (Admin)**
   - **As an** admin  
   - **I want** to manage the type of arts published for showcase  
   - **So that** I can regulate the arts according to the app's rules  
   - **Acceptance Criteria**:  
     - View all arts submitted by artists for approval before publishing  
     - Button to approve submitted arts  
     - Button to reject or reject with reason for a submitted art  
     - Flag rejected artist arts to monitor violation counts for sanctions when needed  
   - **Story Points**: 3

## Definition of Done (DoD)

- **Code complete** for the story (UI wired to simple in-browser data model).  
- **Automated tests** for core logic functions are written and pass locally.  
- **CI pipeline** runs tests on every push and pull request and passes.  
- **Basic logging** (console logs) added for key user actions (add art, save art, purchase, admin decisions).  
- **Documentation updated** (sprint review + retrospective for the sprint).

## Sprint 0 – Planning & Setup

- **Goals**  
  - Refine and document the product backlog and Definition of Done.  
  - Decide technology stack: simple web UI using HTML/CSS/JavaScript with in-browser data and `localStorage`.  
  - Set up the repository with Git and basic project structure.  
  - Configure `npm` with a basic test runner (Vitest).  
  - Draft the CI workflow file (GitHub Actions) that runs `npm install` and `npm test`.

- **Planned Tasks**  
  - Create backlog and sprint planning document (`docs/sprint_plan.md`).  
  - Initialize Git repository and first commit.  
  - Create folders: `src`, `tests`, `docs`, `.github/workflows`.  
  - Install vitest and add `npm test` script.  
  - Draft CI workflow file (to be enabled when the repo is pushed to GitHub).

## Sprint 1 – Execution (First Increment + Pipeline)

- **Sprint Goal**  
  - Deliver a first working increment that allows artists to add art and interested parties to browse and save art, with CI and basic tests in place.

- **Scope (Stories)**  
  - **Story One** – Add Art (Artist).  
  - **Story Two** – Browse & Buy (Interested Party).  
  - **Story Four** – Saved Arts (Interested Party).

- **Implementation Work (Simple Web UI)**  
  - Build a single-page layout with 3 main sections:  
    - `Artist` section:  
      - Modal/form to add art (title, image URL, price, stock quantity).  
      - List of the artist's collection.  
    - `Marketplace` section:  
      - Shows all published arts with price and stock quantity.  
      - Click on an art shows its details and a **“Make Payment”** button (simulated, just logs sale and shows an alert).  
    - `Saved Arts` section:  
      - Shows arts saved by the interested party in the last 15 days using `localStorage` timestamps.  
      - Button to remove a saved art.  
      - Button to “Make Payment” from saved view (same simulated behavior).
  - Implement a small `artService` module (pure JavaScript functions) to:  
    - Add art to an in-memory array + `localStorage`.  
    - Return lists of all arts.  
    - Save/unsave arts with timestamps and filter to last 15 days.  
    - Record a “sale” when payment is simulated.

- **DevOps / Quality Work**  
  - Update `package.json` test script to run Vitest.  
  - Add first unit tests for `artService` core logic (add art, save art, filter saved arts in last 15 days).  
  - Add CI workflow file `.github/workflows/ci.yml` that:  
    - Checks out the code.  
    - Sets up Node.  
    - Installs dependencies.  
    - Runs `npm test`.  
  - Use Git with **small, incremental commits** (e.g., setup, artService, UI skeleton, tests, CI).

- **Sprint 1 Review Artifact**  
  - `docs/sprint1_review.md`: screenshots and short description of:  
    - Adding an art and seeing it in the collection.  
    - Viewing all arts and art details.  
    - Saving arts and viewing them in Saved Arts.  
    - A screenshot of a green CI run and passing tests.

- **Sprint 1 Retrospective Artifact**  
  - `docs/sprint1_retrospective.md`:  
    - What went well (e.g., small commits, simple architecture).  
    - What did not go well (e.g., time spent deciding UI structure).  
    - **At least 2 specific improvements** to apply in Sprint 2 (e.g., start with tests for service functions, improve commit message convention).

## Sprint 2 – Execution & Improvement (Second Increment)

- **Sprint Goal**  
  - Extend the product with artist sales analytics and simple admin moderation, and improve DevOps practices (logging/monitoring, tests).

- **Scope (Stories)**  
  - **Story Three** – View Sales (Artist).  
  - **Story Five** – Admin Moderation (Admin).

- **Implementation Work**  
  - Extend `artService` to:  
    - Record each simulated purchase as a sale with timestamp and amount.  
    - Compute simple statistics: total sales count and total revenue.  
  - Add an `Artist Analytics` section:  
    - Show total number of sales and total revenue.  
    - Show a simple “graph” (e.g., bar-like representation or table by day) based on sales timestamps.  
    - Show a list of individual sales with timestamps.  
  - Add an `Admin` section:  
    - Show a list of “submitted” arts (for simplicity, treat new arts as submitted and require admin approval before they appear as published).  
    - Buttons to **Approve**, **Reject**, or **Reject with reason**.  
    - Track violation counts per artist in data and show a flag when violations exceed a threshold (e.g., 3 rejections).  
  - Wire UI so that only approved arts appear in the Marketplace.

- **DevOps / Quality Work**  
  - Add more unit tests for new `artService` functions (sales stats, approvals, rejects, filtering).  
  - Improve CI to run tests on both push and pull requests to `main`/`master`.  
  - Add **basic monitoring/logging**:  
    - `console.log` for key events (art created, art approved, art rejected, sale recorded).  
    - A simple on-page “System status” box that shows total errors caught in the UI (e.g., failed operations handled with try/catch).

- **Sprint 2 Review Artifact**  
  - `docs/sprint2_review.md`: screenshots and description of:  
    - Artist analytics view with stats and sales list.  
    - Admin view approving/rejecting arts.  
    - Updated CI screenshot showing tests passing including new tests.

- **Sprint 2 Final Retrospective Artifact**  
  - `docs/sprint2_retrospective.md`:  
    - How the process improved from Sprint 1 (e.g., better planning, better test-first approach).  
    - What DevOps practices helped most (CI, small commits, logging).  
    - Key lessons learned for future projects.

