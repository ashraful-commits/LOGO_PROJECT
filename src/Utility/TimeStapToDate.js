export function convertDate(firestoreTimestamp) {
    return new Date(
      firestoreTimestamp.seconds * 1000 + firestoreTimestamp.nanoseconds / 1000000
    ).toLocaleString();
  }
 
  