$(document).ready(function() {

	// Get Repos
	$('body').on('click', '#getGitRepos', function(e) {
		e.preventDefault();
		var htmlTemplate = "",
			$gitHubUserName = $('#gitHubUserName');

		var gitRepoUrl = "https://api.github.com/users/" + $gitHubUserName.val() + "/repos"

		if ($gitHubUserName.val()) {
			$.ajax({
					url: gitRepoUrl, //'https://api.github.com/users/ranjan077/repos',
					//url: 'js/git-repo-sample-json.json',
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					if (data.length > 0) {
						$.each(data, function(index, val) {

							if (val.description && val.description.length > 80) {
								val.description = val.description.slice(0, 79) + "...";
							}

							if (val.description == null) {
								val.description = "- No data -";
							}

							htmlTemplate += '<div class="pinned-repo-item col-xs-12 col-sm-6 col-xl-4">' +
								'<div class="pinned-repo-item-content border p-3 mb-4">' +
								'<div class="repo-title">' +
								'<a href="' + val.html_url + '" title="' + val.name + '">' + val.name + '</a>' +
								'</div>' +
								'<p class="repo-description mt-2 mb-3">' + val.description + '</p>' +
								'<div class="repo-more-data">' +
								'<ul>';
							if (val.language) {
								htmlTemplate += '<li>' +
									'<span class="icon-circle color-' + val.language.toLowerCase() + '"></span> ' + val.language +
									'</li>';
							}
							htmlTemplate += '<li>' +
								'<a href="' + val.stargazers_url + '"><span class="icon-star"></span> ' + val.stargazers_count + '</a>' +
								'</li>' +
								'<li>' +
								'<a href="' + val.forks_url + '"><span class="icon-git"></span> ' + val.forks + '</a>' +
								'</li>' +
								'</ul>' +
								'<button type="button" data-id="' + val.id + '" data-target="#newIssue" data-repo="' + val.name + '" data-owner="' + val.owner.login + '" class="btn btn-success btn-sm btn-new-issue">New issue</button>' +
								'</div>' +
								'</div>' +
								'</div>';
						});

						$('#getResponse').html(htmlTemplate);

						htmlTemplate = "";

					}

				});
		} else {
			alert('Please enter GITHUB username');
		}



	});

	$('body').on('click', '.btn-new-issue', function(e) {

		var $modal = $('#newIssue'),
			$that = $(this);
		$modal.find('.modal-title').text('Create Issue / '+$that.data('repo'));
		$modal.find('#createIssue').data({
			repo: $that.data('repo'),
			owner: $that.data('owner')
		})
		$modal.modal();
	});

	$('body').on('click', '#createIssue', function(e) {

		var $that = $(this),
			$alert = $('.new-issue-submit');

		$.ajax({
				url: 'https://api.github.com/repos/' + $that.data('owner') + '/' + $that.data('repo') + '/issues',
				type: 'POST',
				dataType: 'json',
				data: {
					title: $('#issueTitle').val(),
					body: $('#issueComment').val()
				}
			})
			.done(function(data) {
				console.log('Success: ', data);
				$alert.addClass('alert-success').removeClass('alert-danger').alert();
				$alert.find('p').text(data.responseJSON.message);
				$alert.hide().show().alert();
			}).fail(function(data) {
				$alert.find('p').text(data.responseJSON.message);
				$alert.removeClass('alert-success').addClass('alert-danger');
				$alert.hide().show().alert();
			})

	});

});