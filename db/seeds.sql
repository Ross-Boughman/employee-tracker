INSERT INTO department(name)
    VALUES  ("Research"),
            ("Fermentation"),
            ("Production"),
            ("Sales");

INSERT INTO roles(title, salary, department_id)
    VALUES  ("Head of Cheese Science", 200000, 1),
            ("Cheese Researcher", 70000, 1),
            ("Fermentation Specialist", 75000, 2),
            ("Smelly Cheese Smeller", 80000, 2),
            ("Vat Stirrer", 60000, 3),
            ("Cheese Machinery Technichian", 75000, 3),
            ("Travelling Cheese Salesperson", 70000, 4),           
            ("Head of Cheese Sales", 120000, 4);
            
INSERT INTO employees(first_name, last_name, role_id, manager_id)
    VALUES  ("Frodo", "Baggins", 1, NULL),
            ("Samwise", "Gamgee", 4, NULL),
            ("Meriadoc", "Brandybuck", 6, NULL),
            ("Peregrin", "Took", 3, NULL),
            ("Bilbo", "Baggins", 2, 1),
            ("Sméagol", "Trahald", 2, 1),
            ("Elanor", "Brandyfoot", 5, 5),
            ("Poppy", "Proudfellow", 5, 5),
            ("Rosie", "Cotton", 7, 8),
            ("Elanor", "Fairbairn", 7, 8);

     