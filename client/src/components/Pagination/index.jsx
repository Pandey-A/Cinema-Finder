import { useState } from "react";
import styles from "./styles.module.css";

const Pagination = ({ page, total, limit, setPage }) => {
	const [loading, setLoading] = useState(false);
	const totalPages = Math.ceil(total / limit);

	const onClick = (newPage) => {
		setLoading(true); // Set loading state

		// Simulate a network request (replace with actual data fetching)
		setTimeout(() => {
			setPage(newPage + 1); // Change the page
			setLoading(false); // Reset loading state
		}, 100); // Adjust the timeout as needed
	};

	return (
		<div className={styles.container}>
			{loading && <div className={styles.loading}>Loading...</div>} {/* Loading indicator */}
			{totalPages > 0 && !loading && (
				[...Array(totalPages)].map((_, index) => (
					<button
						onClick={() => onClick(index)}
						className={
							page === index + 1
								? `${styles.page_btn} ${styles.active}`
								: styles.page_btn
						}
						key={index}
						disabled={loading} // Disable buttons while loading
					>
						{index + 1}
					</button>
				))
			)}
		</div>
	);
};

export default Pagination;
