from playwright.sync_api import sync_playwright
import os
import time

def scrape_linkedin_jobs(keyword, location):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)

        # Use saved session if exists
        if os.path.exists("linkedin_state.json"):
            context = browser.new_context(storage_state="linkedin_state.json")
        else:
            context = browser.new_context()

        page = context.new_page()

        # First run: login manually
        if not os.path.exists("linkedin_state.json"):
            page.goto("https://www.linkedin.com/login")
            print("🔑 Please log in manually (username, password, captcha, OTP if any).")
            page.wait_for_timeout(40000)  # 40 sec to login
            context.storage_state(path="linkedin_state.json")
            print("✅ Login saved. Run script again to scrape jobs.")
            browser.close()
            return

        # Go to jobs page
        page.goto(f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}")
        time.sleep(5)  # wait for jobs to render

        # Log the page HTML
        page_html = page.content()  # returns the full HTML
        with open("linkedin_jobs_page.html", "w", encoding="utf-8") as f:
            f.write(page_html)
        print("✅ Page HTML saved to linkedin_jobs_page.html")

        browser.close()


# Run scraper
scrape_linkedin_jobs("Full Stack Developer", "India")
