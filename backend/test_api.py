import requests

def test_remotive():
    response = requests.get("https://remotive.com/api/remote-jobs?search=react")
    print(response.status_code)
    data = response.json()
    print(f"Job count: {data.get('job-count')}")
    if data.get('jobs'):
        job = data['jobs'][0]
        print(f"Title: {job['title']}, Company: {job['company_name']}, URL: {job['url']}")

if __name__ == "__main__":
    test_remotive()
