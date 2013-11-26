"""
TESTS is a dict with all you tests.
Keys for this will be categories' names.
Each test is dict with
    "input" -- input data for user function
    "answer" -- your right answer
    "explanation" -- not necessary key, it's using for additional info in animation.
"""

TESTS = {
    "Basics": [
        {
            "input": [[3, 3], [5, 5], [8, 8], [2, 8], [8, 2]],
            "answer": 2,
            "explanation": [[3, 3, 8, 8], [2, 8, 8, 2]],
        },
        {
            "input": [[2, 2], [2, 5], [2, 8], [5, 2], [7, 2], [8, 2],
                      [9, 2], [4, 5], [4, 8], [7, 5], [5, 8], [9, 8]],
            "answer": 6,
            "explanation": [[2, 2, 2, 8], [2, 2, 9, 2], [2, 8, 9, 8], [2, 5, 7, 5], [5, 2, 9, 8], [5, 8, 9, 2]]
        },
        {
            "input": [
                [2, 2], [2, 5], [2, 8],
                [5, 2], [5, 5], [5, 8],
                [8, 2], [8, 5], [8, 8]],
            "answer": 8,
            "explanation": [
                [2, 2, 8, 8],
                [2, 2, 2, 8],
                [2, 2, 8, 2],
                [2, 5, 8, 5],
                [2, 8, 8, 8],
                [5, 2, 5, 8],
                [8, 2, 8, 8],
                [8, 2, 2, 8],
            ]
        },
        {
            "input": [
                [2, 0], [8, 0],
                [3, 3], [4, 3], [6, 3], [7, 3],
                [4, 6], [6, 6],
                [5, 9]],
            "answer": 5,
            "explanation": [
                [2, 0, 5, 9],
                [8, 0, 5, 9],
                [3, 3, 7, 3],
                [2, 0, 6, 6],
                [8, 0, 4, 6],
            ]
        },
        {
            "input": [
                [5, 1],
                [2, 2], [8, 2],
                [1, 5], [9, 5],
                [2, 8], [8, 8],
                [5, 9]
            ],
            "answer": 0,
            "explanation": [
            ]
        },
        {
            "input": [
                [5, 1],
                [2, 2], [8, 2],
                [1, 5], [5, 5], [9, 5],
                [2, 8], [8, 8],
                [5, 9]
            ],
            "answer": 4,
            "explanation": [
                [5, 1, 5, 9],
                [1, 5, 9, 5],
                [2, 2, 8, 8],
                [8, 2, 2, 8],
            ]
        },
        {
            "input": [
                [5, 0],
                [5, 1],
                [2, 2], [8, 2],
                [0, 5], [1, 5], [5, 5], [9, 5], [10, 5],
                [2, 8], [8, 8],
                [5, 9],
                [5, 10]
            ],
            "answer": 4,
            "explanation": [
                [5, 0, 5, 10],
                [0, 5, 10, 5],
                [2, 2, 8, 8],
                [8, 2, 2, 8],
            ]
        },


    ],
    "Extra": [
        {
            "input": [6, 3],
            "answer": 9,
            "explanation": "6+3=?"
        },
        {
            "input": [6, 7],
            "answer": 13,
            "explanation": "6+7=?"
        }
    ]
}
