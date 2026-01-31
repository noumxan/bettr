# Push Bettr to GitHub

## 1. Install Git (if needed)

In **PowerShell (Run as Administrator)**:

```powershell
choco install git -y
```

Close and reopen your terminal (or Cursor) after install.

Check:

```powershell
git --version
```

---

## 2. Configure Git (first time only)

Replace with your name and email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 3. Create the repo on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** `bettr-social` (or any name you like)
3. **Description:** Optional, e.g. "Bettr — Social, But Better. User-controlled feed & algorithm marketplace."
4. Choose **Public**
5. **Do not** check "Add a README", "Add .gitignore", or "Choose a license" (you already have these in the project)
6. Click **Create repository**

---

## 4. Initialize and push from your PC

In PowerShell, from your project folder:

```powershell
cd E:\Data\Desktop\Bettr

git init
git add .
git commit -m "Initial commit: Bettr social MVP"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bettr-social.git
git push -u origin main
```

Replace **YOUR_USERNAME** with your GitHub username (and **bettr-social** if you used a different repo name).

If GitHub asks you to sign in, use your GitHub account (or a Personal Access Token if you use 2FA).

---

## 5. Done

Your code is on GitHub. You can share the repo URL or clone it elsewhere with:

```powershell
git clone https://github.com/YOUR_USERNAME/bettr-social.git
```
