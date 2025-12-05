# Lab 07 — Browser DB

In this lab I built a small “mock database” in the browser that supports basic CRUD operations and can swap between different storage adapters (in-memory, LocalStorage, JSONBin, and sync) without changing the DB logic. I verified everything using the provided test/demo pages after serving the folder with a local web server. The main challenge was debugging blank test pages caused by a JavaScript module error, which I fixed by checking the browser console and correcting the adapter code.

