# rubocop:disable all
class AddMovedToToIssue < ActiveRecord::Migration[4.2]
  def change
    add_reference :issues, :moved_to, references: :issues
  end
end
