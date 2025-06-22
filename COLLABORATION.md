# 🤝 Collaboration Guide for Evangadi Forum

This guide will help you collaborate efficiently and avoid common pitfalls. Let's build this awesome project together Team! 🚀

---

## 📝 For Direct Cloners (No Fork)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mihret7/Evangadi-Forum
   cd Evangadi-Forum
   ```

2. **Create a New Branch for Your Work**

   ```bash
   git checkout -b firstName-taskName
   ```

3. **Make Your Changes and Commit**

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

4. **Push Your Branch**

   ```bash
   git push origin firstName-taskName
   ```

5. **Open a Pull Request**
   - Go to the repository on GitHub and open a PR from your branch.

---

## 🍴 For Fork & Clone Contributors

1. **Fork the Repository**

   - Click the `Fork` button on GitHub and create your own copy.

2. **Clone Your Fork**

   ```bash
   git clone <your-fork-url>
   cd Evangadi-Forum
   ```

3. **Add the Original Repository as Upstream**

   ```bash
   git remote add upstream https://github.com/mihret7/Evangadi-Forum
   git remote -v   # ✅ Verify remotes
   ```

   - You should see both `origin` (your fork) and `upstream` (the main repo).

4. **Sync with Upstream Regularly**

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

   - This keeps your fork up to date with the latest changes.

5. **Create a Feature Branch**

   ```bash
   git checkout -b firstName-taskName
   ```

6. **Make Changes, Commit, and Push**

   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin firstName-taskName
   ```

7. **Open a Pull Request**
   - Go to your fork on GitHub and open a PR to the main repository.

---

## 🌟 Best Practices

- Always pull the latest changes before starting new work.
- Write clear commit messages.
- Keep your branches focused on a single feature or fix.
- Be respectful and constructive in code reviews.

---

## 🛠️ Useful Git Commands

- `git remote -v` — List all remotes and their URLs.
- `git fetch upstream` — Fetch changes from the main repo.
- `git merge upstream/main` — Merge main repo changes into your branch.
- `git branch` — List all local branches.
- `git checkout <branch>` — Switch branches.

---

Happy Coding Team! 💡
